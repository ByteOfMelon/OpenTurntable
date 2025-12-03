package playback

import (
	"encoding/base64"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/dhowden/tag"
	"github.com/gopxl/beep"
	"github.com/gopxl/beep/flac"
	"github.com/gopxl/beep/mp3"
	"github.com/gopxl/beep/vorbis"
	"github.com/gopxl/beep/wav"
)

type nopReadSeekCloser struct {
	io.ReadSeeker
}

func (n nopReadSeekCloser) Close() error {
	return nil
}

func ReadMetadata(file *os.File) map[string]string {
	metadata := make(map[string]string)

	// Reset file pointer
	file.Seek(0, io.SeekStart)

	tags, err := tag.ReadFrom(file)
	if err != nil {
		metadata["title"] = filepath.Base(file.Name())
		metadata["artist"] = ""
		metadata["album"] = ""
		metadata["albumartist"] = ""
		metadata["composer"] = ""
		metadata["comment"] = ""
		metadata["genre"] = ""
		metadata["year"] = ""
	} else {
		title := tags.Title()
		if title == "" {
			title = filepath.Base(file.Name())
		}
		metadata["title"] = title
		metadata["artist"] = tags.Artist()
		metadata["album"] = tags.Album()
		metadata["albumartist"] = tags.AlbumArtist()
		metadata["composer"] = tags.Composer()
		metadata["comment"] = tags.Comment()
		metadata["genre"] = tags.Genre()
		metadata["year"] = fmt.Sprintf("%d", tags.Year())

		if pic := tags.Picture(); pic != nil {
			metadata["albumArt"] = fmt.Sprintf(
				"data:%s;base64,%s",
				pic.MIMEType,
				base64.StdEncoding.EncodeToString(pic.Data),
			)
		}
	}

	// Get Duration
	file.Seek(0, io.SeekStart)
	ext := strings.ToLower(filepath.Ext(file.Name()))
	var streamer beep.StreamSeekCloser
	var format beep.Format
	var errDecode error

	// Wrap file so streamer.Close() doesn't close the actual file
	rc := nopReadSeekCloser{file}

	switch ext {
	case ".mp3":
		streamer, format, errDecode = mp3.Decode(rc)
	case ".flac":
		streamer, format, errDecode = flac.Decode(rc)
	case ".wav":
		streamer, format, errDecode = wav.Decode(rc)
	case ".ogg":
		streamer, format, errDecode = vorbis.Decode(rc)
	}

	if errDecode == nil {
		duration := float64(streamer.Len()) / float64(format.SampleRate)
		metadata["duration"] = fmt.Sprintf("%f", duration)
		streamer.Close()
	}

	return metadata
}
