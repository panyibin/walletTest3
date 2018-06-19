//
//  RNManager.h
//  SkyWallet
//
//  Created by PanYibin on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface RNManager : NSObject

+ (NSURL*)jsCodeLocation;
+ (RCTRootView*)viewWithModuleName:(NSString*)moduleName initialProperties:(NSDictionary*)initialProperties;

@end

@interface RNBridgeManager : NSObject <RCTBridgeDelegate>

@property (nonatomic, strong) RCTBridge *bridge;

+ (instancetype)sharedInstance;

@end

