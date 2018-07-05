//
//  WalletManager.h
//  SkyWallet
//
//  Created by PanYibin on 2018/3/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WalletBalanceModel.h"

#define WalletSharedManager [WalletManager sharedInstance]

@interface WalletManager : NSObject<RCTBridgeModule>

+ (instancetype)sharedInstance;

- (void)initWallet;
- (NSArray*)getLocalWalletArray;
- (void)addWalletLocally:(GeneralWalletModel*)walletModel;
- (NSInteger)getWalletsCount;
- (GeneralWalletModel*)getCurrentWalletModel;
- (TransactionModel*)parseTransactionUrl:(NSString*)transactionUrl;

- (WalletBalanceModel*)getBalanceOfWallet:(NSString*)walletId coinType:(NSString*)coinType;
- (WalletBalanceModel*)getBalanceOfAddress:(NSString*)address coinType:(NSString*)coinType;

@end

@interface WalletEventEmitter:RCTEventEmitter<RCTBridgeModule>
@end
