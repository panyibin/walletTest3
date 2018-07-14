//
//  SupportedWalletTypeManagerViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/7/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SupportedWalletTypeManagerViewController.h"

@interface SupportedWalletTypeManagerViewController ()

@property (nonatomic, strong) RCTRootView *rctView;

@end

@implementation SupportedWalletTypeManagerViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  self.rctView = [RNManager viewWithModuleName:@"SupportedWalletTypeManagerProcess" initialProperties:@{@"generalWalletModel":self.generalWalletModelDict?:@{}}];
  self.view = self.rctView;
}

@end
