//! This file manages the file server part of the Concierge.

use super::Concierge;
use anyhow::{anyhow, Result};
use futures::{Stream, StreamExt};
use hyper::{Body, StatusCode};
use log::{debug, warn};
use std::{ffi::OsStr, path::Path};
use tokio::{fs::{File, OpenOptions}, io::AsyncWriteExt};
use tokio_util::codec::{BytesCodec, FramedRead};
use uuid::Uuid;
use warp::{reply::Response, Buf};

pub struct FileReply {
    file_name: String,
    file: File,
}

impl FileReply {
    pub fn new(string: impl ToString, file: File) -> Self {
        Self {
            file_name: string.to_string(),
            file,
        }
    }
}

impl warp::Reply for FileReply {
    fn into_response(self) -> Response {
        // Use frameread for maximum efficiency
        let stream = FramedRead::new(self.file, BytesCodec::new());
        hyper::Response::builder()
            .status(StatusCode::ACCEPTED)
            .header(
                "Content-Disposition",
                format!("attachment; filename=\"{}\"", self.file_name),
            )
            .body(Body::wrap_stream(stream))
            .unwrap()
    }
}

pub async fn handle_file_get(concierge: &Concierge, auth: Uuid, string: &str) -> Result<FileReply> {
    // Just check that the the downloader is allowed
    if concierge.clients.contains_key(&auth) {
        let tail_path = Path::new(string);
        let file_path = Path::new(".").join("fs").join(tail_path);

        if let Some(file_name) = file_path.file_name().and_then(OsStr::to_str) {
            if !file_path.is_file() {
                return Err(anyhow!("Not found"));
            }

            return Ok(FileReply::new(
                file_name.to_owned(),
                File::open(file_path).await?,
            ));
        }
    }
    Err(anyhow!("Not found"))
}

pub async fn handle_file_delete(
    concierge: &Concierge,
    auth: Uuid,
    string: &str,
) -> Result<StatusCode> {
    debug!("Received delete request (auth: {}, path: {})", auth, string);
    if let Some(client) = concierge.clients.get(&auth) {
        // Make sure the path is ../fs/client_name/file_name.extension
        let tail_path = Path::new(string);
        if !tail_path.starts_with(Path::new(client.name())) {
            return Ok(StatusCode::FORBIDDEN);
        }

        //
        let file_path = Path::new(".").join("fs").join(tail_path);
        tokio::fs::remove_file(file_path).await?;

        Ok(StatusCode::OK)
    } else {
        Ok(StatusCode::UNAUTHORIZED)
    }
}

pub async fn handle_file_put(
    concierge: &Concierge,
    auth: Uuid,
    string: &str,
    mut stream: impl Stream<Item = Result<impl Buf, warp::Error>> + Unpin,
) -> Result<StatusCode> {
    debug!("Received upload request (auth: {}, path: {})", auth, string);
    if let Some(client) = concierge.clients.get(&auth) {
        // Make sure the path is ../fs/client_name/file_name.extension
        let tail_path = Path::new(string);
        if !tail_path.starts_with(Path::new(client.name())) {
            return Ok(StatusCode::BAD_REQUEST);
        }

        // Create the folder
        let file_path = Path::new(".").join("fs").join(tail_path);
        tokio::fs::create_dir_all(file_path.parent().unwrap()).await?;

        // Open the file
        let mut file = OpenOptions::new()
            .create(true)
            .write(true)
            .open(file_path)
            .await?;

        // Write the file as the data stream is coming through
        while let Some(chunk) = stream.next().await {
            let chunk = chunk?;
            file.write_all(chunk.bytes()).await?;
        }
        file.flush().await?;

        // client.add_file(tail_path.to_owned(), ClientFile::no_target());

        Ok(StatusCode::CREATED)
    } else {
        warn!("A connection attempt to upload without a valid uuid key");
        Ok(StatusCode::UNAUTHORIZED)
    }
}
