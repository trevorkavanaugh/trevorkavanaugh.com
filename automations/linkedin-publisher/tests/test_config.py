"""Tests for the config module."""

from unittest.mock import patch

from linkedin_publisher.config import get_config_dir, is_configured, load_config, save_config


class TestGetConfigDir:
    def test_creates_directory(self, tmp_path):
        config_dir = tmp_path / ".linkedin-publisher"
        with patch("linkedin_publisher.config.Path.home", return_value=tmp_path):
            result = get_config_dir()
        assert result == config_dir
        assert config_dir.exists()
        assert config_dir.is_dir()


class TestSaveAndLoadConfig:
    def test_round_trip(self, tmp_path):
        with patch("linkedin_publisher.config.Path.home", return_value=tmp_path):
            data = {"client_id": "abc123", "person_urn": "urn:li:person:xyz"}
            save_config(data)
            loaded = load_config()
        assert loaded == data

    def test_load_missing_returns_empty(self, tmp_path):
        with patch("linkedin_publisher.config.Path.home", return_value=tmp_path):
            result = load_config()
        assert result == {}


class TestIsConfigured:
    def test_false_when_empty(self, tmp_path):
        with patch("linkedin_publisher.config.Path.home", return_value=tmp_path):
            assert is_configured() is False

    def test_true_with_required_fields(self, tmp_path):
        with patch("linkedin_publisher.config.Path.home", return_value=tmp_path):
            save_config({"client_id": "abc", "person_urn": "urn:li:person:xyz"})
            assert is_configured() is True

    def test_false_with_partial_fields(self, tmp_path):
        with patch("linkedin_publisher.config.Path.home", return_value=tmp_path):
            save_config({"client_id": "abc"})
            assert is_configured() is False
