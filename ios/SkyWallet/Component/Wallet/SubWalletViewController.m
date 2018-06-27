//
//  WalletViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SubWalletViewController.h"

@interface SubWalletViewController ()

@property (nonatomic, strong) RCTRootView *rctView;

@end

@implementation SubWalletViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  
  self.rctView = [RNManager viewWithModuleName:@"SubWalletProcess" initialProperties:nil];
  self.view = self.rctView;
}

@end
