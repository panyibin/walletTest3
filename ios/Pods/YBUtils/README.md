# YBUtils

[![CI Status](http://img.shields.io/travis/panyibin/YBUtils.svg?style=flat)](https://travis-ci.org/panyibin/YBUtils)
[![Version](https://img.shields.io/cocoapods/v/YBUtils.svg?style=flat)](http://cocoapods.org/pods/YBUtils)
[![License](https://img.shields.io/cocoapods/l/YBUtils.svg?style=flat)](http://cocoapods.org/pods/YBUtils)
[![Platform](https://img.shields.io/cocoapods/p/YBUtils.svg?style=flat)](http://cocoapods.org/pods/YBUtils)

## Features
Category for NSTimer, supporting block parameter for OS below iOS 10.

More features coming soon.

## Usage

#import <YBUtils/NSTimer+Yibin.h>

NSTimer *timer1 = [NSTimer yb_timerWithTimeInterval:1 repeats:YES block:^(NSTimer *timer) {

}];

NSTimer *timer2 = [NSTimer yb_scheduledTimerWithTimeInterval:1 repeats:YES block:^(NSTimer *timer) {

}];

## Example

To run the example project, clone the repo, and run `pod install` from the Example directory first.

## Requirements

## Installation

YBUtils is available through [CocoaPods](http://cocoapods.org). To install
it, simply add the following line to your Podfile:

```ruby
pod 'YBUtils'
```

## Author

panyibin, panyibin@outlook.com

## License

YBUtils is available under the MIT license. See the LICENSE file for more info.
