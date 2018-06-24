//
//  GeneralWalletModel.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GeneralWalletModel.h"

@implementation GeneralWalletModel

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  self = [super init];
  if(self) {
    _walletName = [aDecoder decodeObjectForKey:@"walletName"];
    _walletId = [aDecoder decodeObjectForKey:@"walletId"];
    _pinCode = [aDecoder decodeObjectForKey:@"pinCode"];
    _seed = [aDecoder decodeObjectForKey:@"seed"];
    _skycoinWalletModel = [aDecoder decodeObjectForKey:@"skycoinWalletModel"];
    _samosWalletModel = [aDecoder decodeObjectForKey:@"samosWalletModel"];
  }
  
  return self;
}

- (void)encodeWithCoder:(NSCoder *)aCoder {
  [aCoder encodeObject:_walletName forKey:@"walletName"];
  [aCoder encodeObject:_walletId forKey:@"walletId"];
  [aCoder encodeObject:_pinCode forKey:@"pinCode"];
  [aCoder encodeObject:_seed forKey:@"seed"];
  [aCoder encodeObject:_skycoinWalletModel forKey:@"skycoinWalletModel"];
  [aCoder encodeObject:_samosWalletModel forKey:@"samosWalletModel"];
}

- (NSDictionary*)convertToDictionary {
  NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
  [dict setObject:self.walletName forKey:@"walletName"];
  [dict setObject:self.walletId forKey:@"walletId"];
  [dict setObject:self.pinCode forKey:@"pinCode"];
  [dict setObject:self.seed forKey:@"seed"];
  
  NSDictionary *skycoinDict = [self.skycoinWalletModel convertToDictionary];
  NSDictionary *samosDict = [self.samosWalletModel convertToDictionary];
  
  [dict setObject:skycoinDict forKey:@"skycoinWalletModel"];
  [dict setObject:samosDict forKey:@"samosWalletModel"];
  
  return dict;
}

@end
