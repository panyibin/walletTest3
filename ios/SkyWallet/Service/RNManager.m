//
//  RNManager.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RNManager.h"
#import <React/RCTBundleURLProvider.h>

@implementation RNManager

+ (NSURL*)jsCodeLocation {
    NSURL* jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  return jsCodeLocation;
}

+ (RCTRootView*)viewWithModuleName:(NSString*)moduleName initialProperties:(NSDictionary*)initialProperties {
  RCTRootView *view = [[RCTRootView alloc] initWithBridge:[RNBridgeManager sharedInstance].bridge moduleName:moduleName initialProperties:initialProperties];
  
  return view;
}

@end

@implementation RNBridgeManager

+ (instancetype)sharedInstance {
  static RNBridgeManager *_instance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _instance = [[RNBridgeManager alloc] init];
  });
  
  return _instance;
}

- (instancetype)init {
  self = [super init];
  if(self) {
    _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
  }
  
  return self;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [RNManager jsCodeLocation];
}

@end
