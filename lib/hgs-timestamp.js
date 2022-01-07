'use babel';
/**
 * @Author: Hendrik G. Seliger <hank>
 * @Written: 21 December 2021, 10:26 CET by Hendrik G. Seliger (github@hseliger.eu)
 * @Email: github@hseliger.eu
 * @Filename: hgs-timestamp.js
 * @Last changes: 7 January 2022, 09:07 CET by Hendrik G. Seliger (github@hseliger.eu)
 * @License: MIT
 * @Copyright: © Copyright 2022 by Hendrik G. Seliger
 */

import { CompositeDisposable } from 'atom';
import { DateTime } from 'luxon';

module.exports = {
  config: {
    timestampPrefix: {
      type: 'string',
      title: 'Timestamp Prefix',
      default: '@Last changes:',
      description: 'Specify timestamp prefix; replacement will be until end of line!',
      order: 1
    },
    firststampPrefix: {
      type: 'string',
      title: 'Timestamp Prefix',
      default: '@Written:',
      description: 'Specify timestamp prefix used for one-off stamping; replacement will be until end of line!',
      order: 2
    },
    timestampSuffix: {
      type: 'string',
      title: 'Timestamp Suffix',
      default: 'by ' + process.env.USER,
      description: 'Specify suffix to add to timestamps.',
      order: 3
    },
    timestampStd: {
      type: 'string',
      title: 'Use standard or custom timestamps',
      default: 'ISO',
      enum: [
        {value:'ISO', description:'Use ISO standard'},
        {value:'Local', description:'Use local setting per computer locale'},
        {value:'Custom', description:'Use custom setting from below…'}
      ],
      description: 'Choose a standard timestamp format or choose custom and customize below.',
      order: 4
    },
    timestampFormat: {
      type: 'string',
      title: 'Timestamp Format',
      default: "yyyy'-'MM'-'dd'T'HH:'mm:'ss",
      description: 'Specify suffix to add to timestamps.',
      order: 5
    },
    scopeSelector: {
      type: 'string',
      title: 'Scope Selector',
      default: '^comment\\b|plain\\.text',
      description: 'Specify regular expression pattern for scope name in syntax. Use `Editor: Log Cursor Scope` command to get scope names on current cursor.',
      order: 6
    },
    numberOfLines: {
      type: 'integer',
      title: 'Number of Lines',
      default: 8,
      minimum: 1,
      description: 'Number of lines to search from beginning of buffer',
      order: 7
    },
    updateOnSave: {
      type: 'boolean',
      title: 'Auto-run update on save',
      default: true,
      description: 'Update automatically when saving a file.',
      order: 8
    }
  },
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command
    //this.subscriptions.add(atom.commands.add('atom-workspace', {'hgs-timestamp:update-timestamp': () => this.update-timestamp()}));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'hgs-timestamp:update-timestamp': (function(_this) {
        return function() {
          var editor;
          if (editor = atom.workspace.getActiveTextEditor()) {
            return _this.updateTimestamp(editor);
          }
        };
      })(this)
    }));
    // Register for running before each save
    //this.subscriptions.add(editorBuffer.onWillSave(evnt => this.update-timestamp()));
    return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
      return function(editor) {
        return _this.subscriptions.add(editor.getBuffer().onWillSave(function() {
          if (atom.config.get('hgs-timestamp.updateOnSave')) {
            return _this.updateTimestamp(editor);
          }
        }));
      };
    })(this)));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.hgsTimestampView.destroy();
  },

  serialize() {
    return;
  },

  toggle() {
    return;
  },

  updateTimestamp(editor) {
    var buffer, tsFirstPrefix, tsScanRange, tsPrefix, tsScope, tsSuffix, tsFormat, tsType, now, tsText;
    var firstReg, lastReg, tsReplace;
    buffer = editor.getBuffer();
    tsScanRange = [[0, 0], [atom.config.get('hgs-timestamp.numberOfLines'), 0]];
    tsFirstPrefix = atom.config.get('hgs-timestamp.firststampPrefix');
    tsPrefix = atom.config.get('hgs-timestamp.timestampPrefix');
    firstReg = new RegExp(tsFirstPrefix+'[ \t]*$', 'g');
    lastReg = new RegExp(tsPrefix+'.*$', 'g');
    tsSuffix = atom.config.get('hgs-timestamp.timestampSuffix');
    tsScope = new RegExp(atom.config.get('hgs-timestamp.scopeSelector'));
    tsType = atom.config.get('hgs-timestamp.timestampStd');
    tsFormat = atom.config.get('hgs-timestamp.timestampFormat');

    // Calculate the timestamp in the right format
    now = DateTime.now();
    switch (tsType) {
      case "Local":
        tsText = now.toLocaleString(DateTime.DATETIME_FULL);
        break;
      case "Custom":
        tsText = now.toFormat(tsFormat);
        break;
      case "ISO":
      default:
        tsText = now.toISO();
    }

    var tsCallback = function(_arg) {
      // _arg is: match, matchText, range, stop, replace
      // stop and replace are functions to call
      // call replace with the string to replace the match with
      var endPos, lineText, m, scopeDescriptor, str, t;
      endPos = _arg.range.end;
      lineText = buffer.lineForRow(endPos.row);
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(endPos);
      if (scopeDescriptor.getScopesArray().every(function(s) {
        return !tsScope.test(s);
      })) {
        return;
      }
      return _arg.replace(tsReplace);
    }

    // Replace the first written timestamp if empty
    tsReplace = tsFirstPrefix + ' ' + tsText + ' ' + tsSuffix;
    buffer.backwardsScanInRange(firstReg, tsScanRange, tsCallback);

    // Replace the last changes timestamp
    tsReplace = tsPrefix + ' ' + tsText + ' ' + tsSuffix;
    buffer.backwardsScanInRange(lastReg, tsScanRange, tsCallback);
    return;

  }
};
