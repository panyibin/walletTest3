//
//  TransactionModel.m
//  SkyWallet
//
//  Created by PanYibin on 2018/7/1.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "TransactionModel.h"

/**
 example
 {
 "walletId":"sky_coin_ddsd",
 "walletType":"skycoin",
 "transactionType":"out"
 "targetAddress":"ssss",
 "amount":"1",
 "transactionTime":"2018-1-1",
 }
 */

@implementation TransactionModel

- (instancetype)initWithDictionary:(NSDictionary*)dict {
  self = [super init];
  if (self) {
    if ([self fillWithDictionary:dict]) {
      return self;
    } else {
      return nil;
    }
  }
  
  return nil;
}

- (BOOL)fillWithDictionary:(NSDictionary*)dict {
  _dict = dict;
  _walletId = [dict getStringForKey:@"walletId"];
  _walletType = [dict getStringForKey:@"walletType"];
  _transactionType = [dict getStringForKey:@"transactionType"];
  _targetAddress = [dict getStringForKey:@"targetAddress"];
  _amount = [dict getStringForKey:@"amount"];
  _transactionTime = [dict getStringForKey:@"transactionTime"];
  
  if (_walletId.length == 0 || _walletType.length == 0 || _transactionType.length == 0 || _amount.length == 0 || _targetAddress.length == 0) {
    return NO;
  }
  
  return YES;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  self = [super init];
  if (self) {
    _dict = [aDecoder decodeObjectForKey:@"dict"];
    _walletId = [aDecoder decodeObjectForKey:@"walletId"];
    _walletType = [aDecoder decodeObjectForKey:@"walletType"];
    _transactionType = [aDecoder decodeObjectForKey:@"transactionType"];
    _targetAddress = [aDecoder decodeObjectForKey:@"targetAddress"];
    _amount = [aDecoder decodeObjectForKey:@"amount"];
    _transactionTime = [aDecoder decodeObjectForKey:@"transactionTime"];
  }
  
  return self;
}

- (void)encodeWithCoder:(NSCoder *)aCoder {
  [aCoder encodeObject:self.dict forKey:@"dict"];
  [aCoder encodeObject:self.walletId forKey:@"walletId"];
  [aCoder encodeObject:self.walletType forKey:@"walletType"];
  [aCoder encodeObject:self.transactionType forKey:@"transactionType"];
  [aCoder encodeObject:self.targetAddress forKey:@"targetAddress"];
  [aCoder encodeObject:self.amount forKey:@"amount"];
  [aCoder encodeObject:self.transactionTime forKey:@"transactionTime"];
}

- (NSDictionary*)getModelDictionary {
  return self.dict;
}

@end
