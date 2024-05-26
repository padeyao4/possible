use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ConfigFile {
    data_path: PathBuf,
}

impl ConfigFile {
    pub fn default() -> Self {
        Self {
            data_path: PathBuf::from("./data"),
        }
    }
}
