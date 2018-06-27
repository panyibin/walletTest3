//
//  GeneralWalletManagerViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GeneralWalletManagerViewController.h"

@interface GeneralWalletManagerViewController ()

@property (nonatomic, strong) RCTRootView *rctView;

@end

@implementation GeneralWalletManagerViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  self.rctView = [RNManager viewWithModuleName:@"GeneralWalletManagerProcess" initialProperties:nil];
  self.view = self.rctView;
}

@end
