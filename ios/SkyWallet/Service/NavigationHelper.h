//
//  NavigationHelper.h
//  SkyWallet
//
//  Created by PanYibin on 2018/3/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NavigationHelper : NSObject<RCTBridgeModule>

+ (instancetype)sharedInstance;

- (UINavigationController*)rootNavigationController;

+ (void)presentPinInputViewControllerWithCloseButton:(BOOL)hasCloseButton animated:(BOOL)animated pinCodeVerifiedBlock:(void(^)(void))pinCodeVerifiedBlock;

+ (void)dismissPinInputViewControllerAnimated:(BOOL)animated;

@end
