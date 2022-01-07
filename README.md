# hgs-timestamp

Based on atom-timestamp with some adjustments to reflect the details
of applying the stamp, and to permit getting a one-off stamp for the
date of first wrting a file

Update timestamp comments like `Time-stamp: <Jun 02 2006>`, `Time-stamp: <2006-01-02 15:04:05>` to current date/time

This package uses the Luxon library (https://moment.github.io/luxon/#/?id=luxon)

## Usage

### Settings

* `Timestamp Prefix`, `Timestamp Suffix` - Regular expression pattern for timestamp prefix/suffix.

**UPDATE THIS**

* `Timestamp Formats` - Format-string for parsing/updating timestamp. Use [Moment.js format](http://momentjs.com/docs/#/displaying/format/). Time zone tokens (`z`, `zz`) and localized formats (`L`, `l`, ...) do not work.
* `Scope Selector` - Regular expression pattern for [scope name](http://flight-manual.atom.io/behind-atom/sections/scoped-settings-scopes-and-scope-descriptors/) in syntax. By default, atom-timestamp only works in comments in syntax or plain text file.
* `Number Of Lines` - Number of lines from the beginning to search timestamp comments.

### Commands

* `hgs-timestamp:update-timestamp` - Update timestamp comments to current date/time
