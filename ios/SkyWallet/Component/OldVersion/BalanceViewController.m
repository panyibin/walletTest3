//
//  BalanceViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "BalanceViewController.h"
#import <Mobile/Mobile.objc.h>

@interface BalanceViewController ()

@property(nonatomic, strong) NSString *balance;

@end

@implementation BalanceViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  self.navigationController.navigationBar.hidden = YES;
  
  RCTRootView *welcomeView = [[RCTRootView alloc] initWithBundleURL:[RNManager jsCodeLocation] moduleName:@"SkyWallet" initialProperties:nil launchOptions:nil];
  
  [self.view addSubview:welcomeView];
  
  [welcomeView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.mas_equalTo(self.view);
  }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)loadView {
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.view = view;
  self.view.backgroundColor = [UIColor yellowColor];
}

@end
