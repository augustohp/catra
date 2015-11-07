'use strict'

const EventEmitter = require('events')
const util = require('util')
const keypress = require('keypress')
const log = require('./Logger')

var Controls = function(player) {
    EventEmitter.call(this)

    this.player = player || null;
    this.playerState = {
        volume: 1,
        playing: false
    };

    var self = this
    self.trigger = function(eventName) {
        log.debug('Emitting "%s" control event.', eventName)
        self.emit(eventName, self.player, self.playerState)
    }

    keypress(process.stdin);
    process.stdin.on('keypress', function (ch, key) {
        if (key && key.ctrl && key.name == 'c') {
            self.trigger('finish')
        }

        if (key && key.name == 'space') {
            self.trigger('pause')
        }

        if (key && key.name == 'x') {
            self.trigger('stop')
        }

        if (key && key.name == 's') {
            self.trigger('play')
        }

        if (key && key.name == 'up') {
            self.trigger('volume-up')
            self.trigger('volume-updated')
        }

        if (key && key.name == 'down') {
            self.trigger('volume-down')
            self.trigger('volume-updated')
        }

        if (key && key.name == 'right') {
            self.trigger('next-song')
        }

        if (key && key.name == 'left') {
            self.trigger('previous-song')
        }
    });
    process.stdin.setRawMode(true)
    process.stdin.resume()

    self.on('finish', function() {
        process.exit(0);
    })
    .on('pause', function(player, state) {
        state.playing = !state.playing
        player.pause()
    })
    .on('stop', function(player) {
        player.stop()
    })
    .on('play', function(player) {
        player.play()
    })
    .on('next-song', function(player) {
        player.next()
    })
    .on('previous-song', function(player) {
        player.previous()
    })
    .on('volume-up', function(player, state) {
        if (state.volume < 1.0)
            state.volume += 0.1
    })
    .on('volume-down', function(player, state) {
        if (state.volume > 0.1)
            state.volume -= 0.1
    })
    .on('volume-updated', function(player, state) {
        log.debug('Volume updated to %s', Math.floor(state.volume * 100))
        player.setVolume(state.volume)
    })
};
util.inherits(Controls, EventEmitter)

Controls.prototype.attachPlayer = function(musicPlayer) {
    this.player = musicPlayer
}

module.exports = new Controls
