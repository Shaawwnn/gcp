# Chicken-and-egg breaker: creates the GCS bucket that holds the state for the
# parent config. Run this ONCE, before `terraform init` in ../.
#
# Its own state is local and disposable -- if you lose bootstrap/terraform.tfstate,
# re-adopt the bucket with:
#   terraform import google_storage_bucket.tfstate <bucket-name>

terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {
  description = "GCP project that owns the state bucket."
  type        = string
  default     = "future-cat-475815-c2"
}

variable "region" {
  description = "Region for the state bucket. Matches the project region."
  type        = string
  default     = "asia-east1"
}

variable "state_bucket_name" {
  description = "Must match the `bucket` in ../versions.tf. Bucket names are globally unique, hence the project-id prefix."
  type        = string
  default     = "future-cat-475815-c2-tfstate"
}

resource "google_storage_bucket" "tfstate" {
  project  = var.project_id
  name     = var.state_bucket_name
  location = var.region

  # Terraform writes objects directly; uniform access keeps ACLs out of it.
  uniform_bucket_level_access = true

  # Every state write keeps the previous object, so a bad apply is recoverable.
  versioning {
    enabled = true
  }

  # Keep a shallow history rather than every state file ever written.
  lifecycle_rule {
    condition {
      num_newer_versions = 20
    }
    action {
      type = "Delete"
    }
  }

  # State is the one thing you never want a stray `destroy` to take with it.
  lifecycle {
    prevent_destroy = true
  }
}

output "state_bucket" {
  description = "Set this as `bucket` in ../versions.tf."
  value       = google_storage_bucket.tfstate.name
}
