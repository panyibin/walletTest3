//
//  WalletBalanceModel.h
//  SkyWallet
//
//  Created by PanYibin on 2018/3/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface WalletBalanceModel : NSObject

@property (nonatomic, strong) NSString *balance;
@property (nonatomic, strong) NSString *hours;

- (instancetype)initWithDictionary:(NSDictionary*)dict;

@end
