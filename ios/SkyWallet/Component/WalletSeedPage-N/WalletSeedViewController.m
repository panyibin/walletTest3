//
//  WalletSeedViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/27.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "WalletSeedViewController.h"

@interface WalletSeedViewController ()

@property (nonatomic, strong) RCTRootView *walletSeedView;

@end

@implementation WalletSeedViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  self.walletSeedView = [RNManager viewWithModuleName:@"WalletSeedView"
                                    initialProperties:@{@"walletModelDict":self.walletModelDict ? : @{},}];
  
  [self.view addSubview:self.walletSeedView];
  [self.walletSeedView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.mas_equalTo(self.view);
  }];
}

@end
