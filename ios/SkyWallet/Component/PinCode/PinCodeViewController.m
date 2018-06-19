//
//  PinCodeViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "PinCodeViewController.h"

@interface PinCodeViewController ()

@property (nonatomic, strong) RCTRootView *pinView;

@end

@implementation PinCodeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
  self.pinView = [RNManager viewWithModuleName:@"PinView" initialProperties:@{@"walletName":self.walletName ? : @"", @"seed":self.seed ? : @""}];
  
  [self.view addSubview:self.pinView];
  
  [self.pinView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.mas_equalTo(self.view);
  }];
}

@end
