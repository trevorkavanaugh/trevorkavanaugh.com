"""Tests for the formatter module."""


from linkedin_publisher.formatter import format_for_linkedin, read_post, validate_post


class TestReadPost:
    def test_strips_frontmatter(self, tmp_path):
        post_file = tmp_path / "post.md"
        post_file.write_text(
            "---\ntitle: Test Post\ndate: 2024-01-01\n---\nThis is the actual content."
        )
        result = read_post(str(post_file))
        assert result == "This is the actual content."

    def test_handles_plain_text(self, tmp_path):
        post_file = tmp_path / "post.txt"
        post_file.write_text("  Just a plain text post.  \n\n")
        result = read_post(str(post_file))
        assert result == "Just a plain text post."


class TestValidatePost:
    def test_error_on_empty(self):
        issues = validate_post("")
        assert len(issues) == 1
        assert issues[0]["level"] == "error"
        assert "empty" in issues[0]["message"].lower()

    def test_error_on_over_3000_chars(self):
        text = "a" * 3001
        issues = validate_post(text)
        errors = [i for i in issues if i["level"] == "error"]
        assert len(errors) == 1
        assert "3,000" in errors[0]["message"]

    def test_warning_on_over_2800_chars(self):
        text = "a" * 2900
        issues = validate_post(text)
        warnings = [i for i in issues if i["level"] == "warning"]
        assert len(warnings) == 1
        assert "near" in warnings[0]["message"].lower()

    def test_no_issues_for_normal_post(self):
        text = "This is a normal LinkedIn post with #OneHashtag."
        issues = validate_post(text)
        assert len(issues) == 0

    def test_warning_on_many_hashtags(self):
        text = "#one #two #three #four #five #six #seven"
        issues = validate_post(text)
        warnings = [i for i in issues if i["level"] == "warning"]
        assert len(warnings) == 1
        assert "hashtag" in warnings[0]["message"].lower()


class TestFormatForLinkedin:
    def test_strips_markdown_headers(self):
        text = "# Main Title\n\nSome content.\n\n## Subtitle\n\nMore content."
        result, _warnings = format_for_linkedin(text)
        assert "# " not in result
        assert "Main Title" in result
        assert "Subtitle" in result

    def test_removes_bold_markers(self):
        text = "This is **bold** text and more **bold stuff**."
        result, _ = format_for_linkedin(text)
        assert "**" not in result
        assert "bold" in result
        assert "bold stuff" in result

    def test_removes_italic_markers(self):
        text = "This is *italic* text."
        result, _ = format_for_linkedin(text)
        assert result == "This is italic text."

    def test_converts_markdown_links(self):
        text = "Check out [Google](https://google.com) for more."
        result, _ = format_for_linkedin(text)
        assert result == "Check out Google (https://google.com) for more."

    def test_strips_images_with_warning(self):
        text = "Look at this:\n![alt text](image.png)\nNice right?"
        result, warnings = format_for_linkedin(text)
        assert "![" not in result
        assert len(warnings) == 1
        assert "image" in warnings[0].lower()

    def test_strips_html_with_warning(self):
        text = "Hello <b>world</b> and <em>universe</em>."
        result, warnings = format_for_linkedin(text)
        assert "<" not in result
        assert "world" in result
        assert len(warnings) == 1

    def test_collapses_blank_lines(self):
        text = "Line one.\n\n\n\n\nLine two."
        result, _ = format_for_linkedin(text)
        assert result == "Line one.\n\nLine two."
