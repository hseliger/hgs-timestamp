# hgs-timestamp

Based on atom-timestamp with some adjustments to reflect the details
of applying the stamp, and to permit getting a one-off stamp for the
date of first wrting a file

Update timestamp comments like `Written: Jun 02 2006`, `Last changes: 2006-01-02 15:04:05 by foo (bar@foo.bar)` to current date/time

This package uses the Luxon library (https://moment.github.io/luxon/#/?id=luxon)

**Note that this is a package addressing a personal need of mine. I do not have the capacity to make the a public "release" or to actively maintain it. So, feel free to copy, fork, and use at your own risk.**

## Usage

Load into atom by copying the entire folder `hgs-timestamp`into `~/.atom/packages`.

### Settings

* Timestamp Prefix: prefix used to find line with timestamp for last changes. The line will be changed to the end of line, so make sure nothing is on that line that should be kept! 
* First Timestamp Prefix: prefix used to find line with timestamp when first saving the file (when written). The line will be changed to the end of line, so make sure nothing is on that line that should be kept! 
* Timestamp Suffix: text added to the timestamp, such as "by username (email)"
* Use standard or custom settings: easily choose an ISO or locale based timestamp, or choose custom and customize below
* Timestamp format: used Luxon library, so codes can be found here: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
* Scope selector: usually something like "comments", to make sure we're not putting the timestamp right into code
* Number of lines: only seach n lines from top of file, so make quicker and to prevent erraneously placed timestamps
* Auto-run update on save: will automatically search for timestamps and update whenever a file is saved.

Default keybinding on shift-ctrl-h

### Commands

* `hgs-timestamp:update-timestamp` - Update timestamp comments to current date/time
