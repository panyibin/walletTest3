//
//  GeneralWalletViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GeneralWalletViewController.h"

@interface GeneralWalletViewController ()

@property (nonatomic, strong) RCTRootView *rctView;

@end

@implementation GeneralWalletViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  self.rctView = [RNManager viewWithModuleName:@"GeneralWalletView" initialProperties:nil];
  self.view = self.rctView;
}

@end
