//
//  WalletBalanceModel.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "WalletBalanceModel.h"
@interface WalletBalanceModel ()
@property (nonatomic, strong) NSDictionary *dict;//original
@end

@implementation WalletBalanceModel

- (instancetype)initWithDictionary:(NSDictionary*)dict {
  self = [super init];
  if (self) {
    _dict = dict;
    
    _balance = [dict getStringForKey:@"balance"];
    _hours = [dict getStringForKey:@"hours"];
    if(!_hours) {
      NSInteger hours = [dict getIntegerForKey:@"hours"];
      _hours = [NSString stringWithFormat:@"%ld", hours];
    }
  }
  
  return self;
}

- (NSDictionary*)getModelDictionary {
  return self.dict;
}

@end
