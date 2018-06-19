//
//  WalletModel.h
//  SkyWallet
//
//  Created by PanYibin on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface WalletModel : NSObject<NSCoding>

@property(nonatomic, strong) NSString *walletName;
@property(nonatomic, strong) NSString *walletId;
@property(nonatomic, strong) NSString *pinCode;
@property(nonatomic, strong) NSString *seed;
@property(nonatomic, strong) NSString *walletType;

- (instancetype)initWithDictionary:(NSDictionary*)dict;
- (NSDictionary*)convertToDictionary;

@end
