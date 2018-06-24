//
//  MainTabBarViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "MainTabBarViewController.h"
#import "GeneralWalletViewController.h"
#import "MeViewController.h"

@interface MainTabBarViewController ()

@property (nonatomic, strong) GeneralWalletViewController *generalWalletVC;
@property (nonatomic, strong) MeViewController *meVC;

@end

@implementation MainTabBarViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  
  self.generalWalletVC = [GeneralWalletViewController new];
  self.meVC = [MeViewController new];
  
  self.generalWalletVC.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"" image:[UIImage imageNamed:@"wallet"] tag:0];
  self.meVC.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"" image:[UIImage imageNamed:@"me"] tag:0];
  
  self.viewControllers = @[self.generalWalletVC, self.meVC];
}

- (void)viewWillAppear:(BOOL)animated {
  self.navigationController.navigationBar.hidden = YES;
}

@end
