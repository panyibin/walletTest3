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

@interface MainTabBarViewController ()<UITabBarControllerDelegate>

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
  
  self.delegate = self;

  [[UITabBar appearance] setTintColor:[UIColor blackColor]];
  [[UITabBar appearance] setBarTintColor:[UIColor colorWithRed:239/255. green:238/255. blue:218/255. alpha:1.]];
}

- (void)viewWillAppear:(BOOL)animated {
  self.navigationController.navigationBar.hidden = YES;
  self.navigationController.interactivePopGestureRecognizer.enabled = YES;
}

- (void)tabBarController:(UITabBarController *)tabBarController didSelectViewController:(UIViewController *)viewController {
  NSLog(@"did select tab");
  if ([viewController isKindOfClass:[MeViewController class]]) {
    self.sideMenuController.leftViewEnabled = NO;
  } else {
    self.sideMenuController.leftViewEnabled = YES;
  }
  
}

@end
