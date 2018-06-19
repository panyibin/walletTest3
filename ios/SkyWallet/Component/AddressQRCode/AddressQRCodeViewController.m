//
//  AddressQRCodeViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "AddressQRCodeViewController.h"

@interface AddressQRCodeViewController ()

@property (nonatomic, strong) RCTRootView *addressQRCodeView;

@end

@implementation AddressQRCodeViewController

- (void)viewDidLoad {
  [super viewDidLoad];
  
  self.addressQRCodeView = [RNManager viewWithModuleName:@"AddressQRCodeView"
                                       initialProperties:@{@"address":self.address ? : @""}];
  [self.view addSubview:self.addressQRCodeView];
  
  [self.addressQRCodeView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.mas_equalTo(self.view);
  }];
  
//  UIImage *qrCodeImage = [SWUtils qrCodeImageWithString:self.address ? : @"" width:150 height:150];
//  UIImageView *qrCodeImageView = [[UIImageView alloc] initWithImage:qrCodeImage];
//  
//  [self.view addSubview:qrCodeImageView];
//  
//  [qrCodeImageView mas_makeConstraints:^(MASConstraintMaker *make) {
//    make.left.mas_equalTo(self.view).offset(10);
//    make.top.mas_equalTo(self.view).offset(100);
//    make.width.mas_equalTo(200);
//    make.height.mas_equalTo(200);
//  }];
}

- (void)loadView {
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  view.backgroundColor = [UIColor whiteColor];
  self.view = view;
}

@end
