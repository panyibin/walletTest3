//
//  GeneralWalletGeneratorViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GeneralWalletGeneratorViewController.h"

@interface GeneralWalletGeneratorViewController ()

@property (nonatomic, strong) RCTRootView *rctView;

@end

@implementation GeneralWalletGeneratorViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  
  self.rctView = [RNManager viewWithModuleName:@"CreateWalletProcess" initialProperties:nil];
  self.view = self.rctView;
}

@end
