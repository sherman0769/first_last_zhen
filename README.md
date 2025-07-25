# Video Frame Capture Tool

A small React + TypeScript application that lets you upload a video and download any frame as an image.

## Features

- Drag & drop or select a video file to load it
- Seek with a slider and play controls
- Capture the first, current or last frame as a PNG file
- Video playback position is restored after capturing
- Object URLs are cleaned up when the video changes

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open your browser at the printed local address to use the tool.

To create a production build:

```bash
npm run build
```

Lint the project:

```bash
npm run lint
```
