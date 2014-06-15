pulse
=====

Office chat & announcement server with a few guiding principles:

- clean, elegant interface
- features left open and "abusable"
- fun, and more fun with hidden features

Features:

- announcement list for time-sensitive announcements (eg. donuts in the kitchen)
	- uses webkit/chrome notifications
	- can be connected to a vocalize server to pass announcements to a Sonos speaker system through text-to-speech 
- chat room with support for images, links, emojis, and more
- Yammer wrapper with fully threaded conversations, to enable:
	- register your app http://developer.yammer.com/introduction/#gs-registerapp
	- set the Javascript Origins for your app under Basic Info to your server url (https://www.yammer.com/client_applications)
	- set yammer.clientId to your Yammer Client Id in settings.json