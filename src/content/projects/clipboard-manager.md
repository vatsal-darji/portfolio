---
title: "Paste Pilot - Clipboard Manager"
description: "A fast and lightweight clipboard manager that helps you organize and manage your clipboard history."
tech:
  - Electron
  - JavaScript
  - Electron IPC
  - electron-store
  - Linux tray integration
github: "https://github.com/vatsal-darji/paste-pilot"
featured: true
---

Paste Pilot is a lightweight clipboard manager for Linux that helps users keep track of copied text and images, search previous entries, and quickly restore them whenever needed. It is designed to feel fast, minimal, and unobtrusive in everyday use.

## Problem

Copy-paste workflows often break when important content is overwritten by the next item in the clipboard. The goal of this project was to build a simple desktop utility that makes clipboard history easily accessible, reduces friction in daily productivity, and keeps the experience lightweight rather than overloaded with unnecessary features.

## Approach

I built Paste Pilot with Electron to create a cross-platform-style desktop experience while still working closely with native system behavior on Linux. The app continuously monitors clipboard changes, stores recent text and image entries locally, and exposes them through a compact popup interface. I used Electron’s main process for clipboard access, tray behavior, window management, and global shortcuts, while the renderer handles search, interaction, and history display through a clean UI connected with secure IPC communication.

## What I liked about this build

What I liked most about this project was building something small but genuinely useful. It was rewarding to work on features that directly improve everyday workflow, especially the combination of clipboard tracking, tray access, and instant recall through a keyboard shortcut. I also enjoyed keeping the product minimal, where the focus stayed on speed, simplicity, and practical value instead of adding unnecessary complexity.
