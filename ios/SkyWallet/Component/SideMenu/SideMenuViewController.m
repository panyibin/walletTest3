//
//  SideMenuViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SideMenuViewController.h"

@interface SideMenuViewController ()

@property (nonatomic, strong) RCTRootView *rctView;

@end

@implementation SideMenuViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  self.rctView = [RNManager viewWithModuleName:@"SideMenuView" initialProperties:nil];
  self.view = self.rctView;
}

@end
