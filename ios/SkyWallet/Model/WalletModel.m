//
//  WalletModel.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "WalletModel.h"

@implementation WalletModel

- (instancetype)initWithDictionary:(NSDictionary*)dict {
  self = [super init];
  if (self) {
    _walletName = [dict getStringForKey:@"walletName"];
    _walletId = [dict getStringForKey:@"walletId"];
    _pinCode = [dict getStringForKey:@"pinCode"];
    _seed = [dict getStringForKey:@"seed"];
    _walletType = [dict getStringForKey:@"walletType"];
  }
  
  return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  self = [super init];
  if(self) {
    _walletName = [aDecoder decodeObjectForKey:@"walletName"];
    _walletId = [aDecoder decodeObjectForKey:@"walletId"];
    _pinCode = [aDecoder decodeObjectForKey:@"pinCode"];
    _seed = [aDecoder decodeObjectForKey:@"seed"];
    _walletType = [aDecoder decodeObjectForKey:@"walletType"];
  }
  
  return self;
}


- (void)encodeWithCoder:(NSCoder *)aCoder {
  [aCoder encodeObject:_walletName forKey:@"walletName"];
  [aCoder encodeObject:_walletId forKey:@"walletId"];
  [aCoder encodeObject:_pinCode forKey:@"pinCode"];
  [aCoder encodeObject:_seed forKey:@"seed"];
  [aCoder encodeObject:_walletType forKey:@"walletType"];
}

- (NSDictionary*)convertToDictionary {
  NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
  [dict setObject:self.walletName forKey:@"walletName"];
  [dict setObject:self.walletId forKey:@"walletId"];
  [dict setObject:self.pinCode forKey:@"pinCode"];
  [dict setObject:self.seed forKey:@"seed"];
  [dict setObject:self.walletType forKey:@"walletType"];
  
  return dict;
}

@end
