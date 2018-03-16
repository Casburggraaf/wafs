# WAFS
The course repo for 'Web App From Scratch'

[Link](https://www.icloud.com/keynote/0TwXmIELjS6nRcNJSDAG7hVkA#Breek_het_Web) to the powerpoint

## Browser Technologies

### Progressive Enhancement

#### No style
When there is no css loaded the app breaks. Every section(page) is viable. The app can still be controlled but its far from easy

To fix
- better "html" styling
- Move navigation to the top of the page.


#### No imgages
The application works without images, only the loader spinner is visible on every page. The loader function is watching for the images beeing finished loading. Only because the plugin that disabled images is not giving my script a error the loader is still visable and not giving the user a error feedback

To fix
- Research into the plugin for a event that disabled images.

#### No JS
With no Js the application is completely broken(no shit...). But the homepage is "visable"

To fix
- A error page if the js is not loaded or failed to loader
- Serverside rendering of the Page

#### Custom fonts
There is no usage of custom fonts so there is nothing broken...

#### No colour
There is a need of a big improvement on this side. Black text on a dark background on the homepage en popular page. And on the detail page there is just text on images.

To fix
- Better contracts colour
- A background on behind the text of the detail Page

#### No colour
There is a need of a big improvement on this side. Black text on a dark background on the homepage en popular page. And on the detail page there is just text on images.

To fix
- Better contracts colour
- A background on behind the text of the detail Page

#### Broadband internet
When programming this website a lot of features where designed to improve the usage for users with slow network speed.
- A loaderGif
- Usage of locallstorage
- Not loading of content that is not displayed
- Lazyloading of images

What can improved
- Low res images for slow speed networks
- putting loadergif into the locallstorage

#### mouse/trackpad
The website is usable without mouse an trackpad.
What can be inproved
- Nav on the top
- Fast tab to nav

