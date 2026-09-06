terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }

  # State lives in the bucket created by ./bootstrap. Run that first --
  # `terraform init` here fails until the bucket exists.
  backend "gcs" {
    bucket = "future-cat-475815-c2-tfstate"
    prefix = "gcp-learning/foundation"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
