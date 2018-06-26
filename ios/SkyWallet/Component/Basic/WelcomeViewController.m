//
//  WelcomeViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "WelcomeViewController.h"

@interface WelcomeViewController ()

@property (nonatomic, strong) RCTRootView *rctView;

@end

@implementation WelcomeViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  self.rctView = [RNManager viewWithModuleName:@"WelcomeProcess" initialProperties:nil];
  self.view = self.rctView;
}

- (void)viewWillAppear:(BOOL)animated {
  self.navigationController.navigationBar.hidden = YES;
}

@end
