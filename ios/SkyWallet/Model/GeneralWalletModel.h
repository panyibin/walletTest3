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
@property (nonatomic, strong) NSString *avatar;
@property (nonatomic, strong) NSMutableArray *subWalletArray;//current contain 'samos', 'sky'
@property (nonatomic, strong) NSMutableArray *supportedWalletTypes;

- (instancetype)initWithDictionary:(NSDictionary*)dict;
- (NSDictionary*)getModelDictionary;

@end
