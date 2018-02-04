# test-website-performance-with-puppeteer
Code used in article https://michaljanaszek.com/blog/test-website-performance-with-puppeteer


## Build Setup

### Build [vue hn applictaion](https://vue-hn.now.sh) 

Clone https://github.com/Everettss/vue-hackernews-2.0 and inside that project run:

``` bash
# install dependencies
npm install

# build for production
npm run build

# serve in production mode at `localhost:8080`
npm start
```
This fork of `vue-hackernews-2.0` enables ServiceWorker on localhost and adds `console.timeStamp` in `src/views/ItemList.vue`

### Run tests


``` bash
# install dependencies
npm install
```

If you have running `vue-hackernews-2.0` on `localhost:8080` run test (for example):


``` bash
# run Navigation Timing API test
# https://michaljanaszek.com/blog/test-website-performance-with-puppeteer#navigationTimingAPI
node 1/index.js
```
