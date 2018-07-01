//
//  TransactionModel.h
//  SkyWallet
//
//  Created by PanYibin on 2018/7/1.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 example
 {
 "walletId":"sky_coin_ddsd",
 "walletType":"sky",
 "transactionType":"out"
 "targetAddress":"ssss",
 "amount":"1",
 "transactionTime":"2018-1-1",
 }
 */
@interface TransactionModel : NSObject<NSCoding>

@property (nonatomic, strong) NSDictionary *dict;

@property (nonatomic, strong) NSString *walletId;
@property (nonatomic, strong) NSString *walletType;
@property (nonatomic, strong) NSString *transactionType;//out, in
@property (nonatomic, strong) NSString *targetAddress;
@property (nonatomic, strong) NSString *amount;
@property (nonatomic, strong) NSString *transactionTime;

- (instancetype)initWithDictionary:(NSDictionary*)dict;
- (NSDictionary*)getModelDictionary;

@end
