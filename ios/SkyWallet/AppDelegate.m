/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "MainNavigationViewController.h"
#import "BalanceViewController.h"
#import "MainViewController.h"
#import "PinInputViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

  MainNavigationViewController *navigationVC = [[MainNavigationViewController alloc] init];
  MainViewController *mainVC = [[MainViewController alloc] initWithNibName:@"MainViewController" bundle:nil];
  navigationVC.viewControllers = @[mainVC];
  self.window.rootViewController = navigationVC;
  
  [self.window makeKeyAndVisible];
  
  [[WalletManager sharedInstance] initWallet];
  
  //show pin coe input UI when start
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  
  if (pinCode) {
    [NavigationHelper presentPinInputViewControllerWithCloseButton:NO animated:NO pinCodeVerifiedBlock:nil];
  }
  
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {

}

- (void)applicationDidEnterBackground:(UIApplication *)application {
  NSTimeInterval currentTime = [[NSDate date] timeIntervalSince1970];
  [[NSUserDefaults standardUserDefaults] setDouble:currentTime forKey:kLastSuccessfulSessionTime];
  [[NSUserDefaults standardUserDefaults] synchronize];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  
  if (pinCode) {
    NSTimeInterval spaceTimeToInputPinCode = 0;
    
    NSTimeInterval lastTime = [[NSUserDefaults standardUserDefaults] doubleForKey:kLastSuccessfulSessionTime];
    NSTimeInterval currentTime = [[NSDate date] timeIntervalSince1970];
    
    if (currentTime - lastTime > spaceTimeToInputPinCode) {
      [NavigationHelper dismissPinInputViewControllerAnimated:NO];
      [NavigationHelper presentPinInputViewControllerWithCloseButton:NO animated:NO pinCodeVerifiedBlock:nil];
    }
  }
}

@end
