//
//  WalletGeneratorViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "WalletGeneratorViewController.h"

@interface WalletGeneratorViewController ()

@end

@implementation WalletGeneratorViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
  
  self.navigationController.navigationBar.hidden = YES;
  
  NSString *defaultSeed = MobileNewSeed();
  
  RCTRootView *newWalletView = [RNManager viewWithModuleName:@"WalletGenerator"
                                           initialProperties:@{
                                                               @"needPinCode":@(self.needPinCode),
                                                               @"showGenerateSeedButton":@(self.showGenerateSeedButton),
                                                               @"defaultSeed":(self.showGenerateSeedButton ? defaultSeed : @"")
                                                            }];
  [self.view addSubview:newWalletView];
  
  [newWalletView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.mas_equalTo(self.view);
  }];
}

- (void)viewDidAppear:(BOOL)animated {
  if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)]) {
    //disable swipe to back gesture on wallet generator page when user first use our app
    if (self.needPinCode) {
      self.navigationController.interactivePopGestureRecognizer.enabled = NO;
    } else {
      self.navigationController.interactivePopGestureRecognizer.enabled = YES;
    }
  }
}

- (void)viewDidDisappear:(BOOL)animated {
  //re-enable swipe to back gesture when view disappear
  if ([self.navigationController respondsToSelector:@selector(interactivePopGestureRecognizer)]) {
      self.navigationController.interactivePopGestureRecognizer.enabled = YES;
  }
}

@end
