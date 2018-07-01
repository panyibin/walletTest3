//
//  GeneralWalletModel.m
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GeneralWalletModel.h"

@implementation GeneralWalletModel

- (instancetype)initWithDictionary:(NSDictionary*)dict {
  self = [super init];
  if (self) {
    _walletName = [dict getStringForKey:@"walletName"];
    _walletId = [dict getStringForKey:@"walletId"];
    _seed = [dict getStringForKey:@"seed"];
    _pinCode = [dict getStringForKey:@"pinCode"];
    
    NSArray *subWalletDictArray = [dict getArrayForKey:@"subWalletArray"];
    NSMutableArray *mutableSubWalletArray = [NSMutableArray new];
    for (NSDictionary *subWalletDict in subWalletDictArray) {
      if ([subWalletDict isKindOfClass:[NSDictionary class]]) {
        WalletModel *wm = [[WalletModel alloc] initWithDictionary:subWalletDict];
        if (wm) {
          [mutableSubWalletArray addObject:wm];
        }
      }
    }
    
    _subWalletArray = mutableSubWalletArray;
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
    _subWalletArray = [aDecoder decodeObjectForKey:@"subWalletArray"];
//    _skycoinWalletModel = [aDecoder decodeObjectForKey:@"skycoinWalletModel"];
//    _samosWalletModel = [aDecoder decodeObjectForKey:@"samosWalletModel"];
  }
  
  return self;
}

- (void)encodeWithCoder:(NSCoder *)aCoder {
  [aCoder encodeObject:_walletName forKey:@"walletName"];
  [aCoder encodeObject:_walletId forKey:@"walletId"];
  [aCoder encodeObject:_pinCode forKey:@"pinCode"];
  [aCoder encodeObject:_seed forKey:@"seed"];
  [aCoder encodeObject:_subWalletArray forKey:@"subWalletArray"];
//  [aCoder encodeObject:_skycoinWalletModel forKey:@"skycoinWalletModel"];
//  [aCoder encodeObject:_samosWalletModel forKey:@"samosWalletModel"];
}

- (NSDictionary*)getModelDictionary {
  NSMutableDictionary *dict = [[NSMutableDictionary alloc] init];
  [dict setObject:self.walletName forKey:@"walletName"];
  [dict setObject:self.walletId forKey:@"walletId"];
  [dict setObject:self.pinCode forKey:@"pinCode"];
  [dict setObject:self.seed forKey:@"seed"];
  
  NSMutableArray *subWalletDictArray = [NSMutableArray new];
  for (WalletModel *wm in self.subWalletArray) {
    NSDictionary *wmDict = [wm convertToDictionary];
    [subWalletDictArray addObject:wmDict];
  }
  
  [dict setObject:subWalletDictArray forKey:@"subWalletArray"];
//  NSDictionary *skycoinDict = [self.skycoinWalletModel convertToDictionary];
//  NSDictionary *samosDict = [self.samosWalletModel convertToDictionary];
//  
//  [dict setObject:skycoinDict forKey:@"skycoinWalletModel"];
//  [dict setObject:samosDict forKey:@"samosWalletModel"];
  
  return dict;
}

@end
