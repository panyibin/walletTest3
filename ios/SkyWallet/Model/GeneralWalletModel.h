//
//  GeneralWalletModel.h
//  SkyWallet
//
//  Created by PanYibin on 2018/6/24.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WalletModel.h"

/**
 Multi coins wallet model
 */
@interface GeneralWalletModel : NSObject<NSCoding>

@property (nonatomic, strong) NSString *walletName;
@property (nonatomic, strong) NSString *walletId;
@property (nonatomic, strong) NSString *seed;
@property (nonatomic, strong) NSString *pinCode;
@property (nonatomic, strong) WalletModel *skycoinWalletModel;
@property (nonatomic, strong) WalletModel *samosWalletModel;

- (NSDictionary*)convertToDictionary;

@end
