//
//  SendCoinViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SendCoinViewController.h"

@interface SendCoinViewController ()

@property (nonatomic, strong) RCTRootView *rctView;

@end

@implementation SendCoinViewController

- (instancetype)initWithTransactionModel:(TransactionModel*)transactionModel {
  self = [super init];
  if (self) {
    _transactionModel = transactionModel;
  }
  
  return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
  NSDictionary *transactionModelDict = self.transactionModel ? [self.transactionModel getModelDictionary] : nil;
  NSDictionary *initialProperties = @{
                                      @"transactionDict":transactionModelDict ? : @{}
                                      };
  self.rctView = [RNManager viewWithModuleName:@"SendCoinProcess" initialProperties:initialProperties];
  
  self.view = self.rctView;
}

@end
