use std::{
    fs::{self, File},
    io::Write,
    path::PathBuf,
};

use serde_json::from_str;
use tauri::{api, command};

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum GitAuthMethod {
    Password,
    Key,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ConfigFile {
    base_path: PathBuf,
    data_dir: String,
    config_file_name: String,
    remote_enable: bool,
    git_enable: bool,
    git_auth_method: GitAuthMethod,
    git_url: String,
    git_username: String,
    git_password: String,
    git_ssh_key: PathBuf,
}

impl ConfigFile {
    pub fn default() -> Self {
        Self {
            base_path: get_base_path().unwrap(),
            data_dir: String::from("data"),
            config_file_name: String::from("config.json"),
            remote_enable: false,
            git_enable: false,
            git_url: "".to_owned(),
            git_username: "".to_owned(),
            git_password: "".to_owned(),
            git_ssh_key: PathBuf::new(),
            git_auth_method: GitAuthMethod::Key,
        }
    }
}

fn get_base_path() -> Option<PathBuf> {
    let context = tauri::generate_context!();
    let config = context.config();
    api::path::app_data_dir(config)
}

#[command]
pub fn read_config() -> ConfigFile {
    let config_path = get_base_path().map(|f| {
        let mut o = f.clone();
        o.push("config.json");
        o
    });

    return match config_path {
        Some(path) => {
            if path.is_file() {
                let s = fs::read_to_string(path).unwrap();
                from_str(&s).unwrap()
            } else {
                ConfigFile::default()
            }
        }
        None => ConfigFile::default(),
    };
}

#[command]
pub fn write_config(config: ConfigFile) {
    let config_path = get_base_path()
        .map(|f| {
            let mut o = f.clone();
            o.push("config.json");
            o
        })
        .unwrap();
    let mut file = File::create(config_path).unwrap();
    let json = serde_json::to_string_pretty(&config).unwrap();
    file.write_all(json.as_bytes()).unwrap();
}
