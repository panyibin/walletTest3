//
//  WalletManager.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/16.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "WalletManager.h"

@implementation WalletManager

RCT_EXPORT_MODULE()

+ (instancetype)sharedInstance {
  static WalletManager *_instance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _instance = [[self alloc] init];
  });
  
  return _instance;
}

RCT_REMAP_METHOD(getSeed, getSeedWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *seed = [self getSeed];
  resolve(seed);
}

- (NSString*)getSeed {
  NSString *seed = MobileNewSeed();
  return seed;
}

RCT_REMAP_METHOD(getLocalPinCode, getLocalPinCodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  resolve(pinCode);
}

RCT_REMAP_METHOD(hasPinCode, hasPinCodeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  if (pinCode && pinCode.length > 0) {
    resolve(@(YES));
  } else {
    resolve(@(NO));
  }
}

RCT_REMAP_METHOD(createPinCode, createPinCode:(NSString*)pinCode resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (pinCode && [pinCode isKindOfClass:[NSString class]] && pinCode.length > 0) {
    [[NSUserDefaults standardUserDefaults] setObject:pinCode forKey:kPinCode];
    resolve(@(YES));
  } else {
    resolve(@(NO));
  }
}

RCT_REMAP_METHOD(createNewWallet, createWallet:(NSString*)walletName seed:(NSString*)seed pinCode:(NSString*)pinCode avatar:(NSString*)avatar resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  BOOL success = [self createWallet:walletName seed:seed pinCode:pinCode avatar:avatar];
  
  resolve(@(success));
}

//RCT_REMAP_METHOD(createNewWallet, createWallet:(NSString*)walletName seed:(NSString*)seed resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
//  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
//  BOOL success = [self createWallet:walletName seed:seed pinCode:pinCode];
//  
//  resolve(@(success));
//}

- (BOOL)createWallet:(NSString*)walletName seed:(NSString*)seed pinCode:(NSString*)pinCode avatar:(NSString*)avatar {
  if(!walletName || !seed || !pinCode) {
    return NO;
  }
  
  NSError *error;
  NSString *password = [self passwordWithPinCode:pinCode];
  MobileInit([self getWalletDir], password, &error);
  if (!error) {
    [self registerNewCoin];
    [[NSUserDefaults standardUserDefaults] setObject:pinCode forKey:kPinCode];
  }
  
  NSString *skyWalletId = MobileNewWallet(kCoinTypeSky, walletName, seed, password, &error);
  NSString *samosWalletId = MobileNewWallet(kCoinTypeSamos, walletName, seed, password, &error);
  
  if(!error) {
    //create 4 extra addresses,
    MobileNewAddress(skyWalletId, 4, password, &error);
    MobileNewAddress(samosWalletId, 4, password, &error);
    
    WalletModel *skyWM = [[WalletModel alloc] init];
    skyWM.walletName = walletName;
    skyWM.walletId = skyWalletId;
    skyWM.walletType = kCoinTypeSky;
    skyWM.pinCode = pinCode;
    skyWM.seed = seed;
    
    WalletModel *samosWM = [WalletModel new];
    samosWM.walletName = walletName;
    samosWM.walletId = samosWalletId;
    samosWM.walletType = kCoinTypeSamos;
    samosWM.pinCode = pinCode;
    samosWM.seed = seed;
    
    GeneralWalletModel *generalWM = [GeneralWalletModel new];
    generalWM.walletId = samosWalletId;
    generalWM.walletName = walletName;
    generalWM.seed = seed;
    generalWM.pinCode = pinCode;
    
    if (avatar) {
      generalWM.avatar = avatar;
    } else {
      generalWM.avatar = @"avatar1";
    }
    
    generalWM.subWalletArray = [NSMutableArray arrayWithObjects:samosWM, skyWM, nil];
    generalWM.supportedWalletTypes = [NSMutableArray arrayWithObjects:kCoinTypeSamos, nil];
//    generalWM.skycoinWalletModel = wm;
//    generalWM.samosWalletModel = samosWM;
    
    [self addWalletLocally:generalWM];
    
    [[NSNotificationCenter defaultCenter] postNotificationName:kNewWalletCreatedNotification object:nil];
    
    [[NSUserDefaults standardUserDefaults] setObject:generalWM.walletId ? : @"" forKey:kCurrentWalletId];
    
    return YES;
  } else {
    return NO;
  }
}

RCT_REMAP_METHOD(getCurrentWalletDict, getCurrentWalletDictWithResolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
  GeneralWalletModel *currentWalletModel = [self getCurrentWalletModel];
  NSDictionary *currentWalletModelDict = [currentWalletModel getModelDictionary];
  
  resolve(currentWalletModelDict ? : @{});
}

- (GeneralWalletModel*)getCurrentWalletModel {
  NSString *currentWalletId = [[NSUserDefaults standardUserDefaults] stringForKey:kCurrentWalletId];
  
  if (currentWalletId && currentWalletId.length > 0) {
    NSArray *localWalletArray = [self getLocalWalletArray];
    for (GeneralWalletModel *wm in localWalletArray) {
      if ([wm.walletId isEqualToString:currentWalletId]) {
        return wm;
      }
    }
    
    return nil;
  } else {
    return nil;
  }
}

RCT_REMAP_METHOD(createNewAddressWithWalletId, createNewAddressWithWalletId:(NSString*)walletId num:(NSInteger)num resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject){
  NSError *error;
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  NSString *password = [self passwordWithPinCode:pinCode];
  MobileNewAddress(walletId, num, password, &error);

  if (!error) {
    resolve(@"success");
  } else {
    resolve(@"failed");
  }
  
  [[NSNotificationCenter defaultCenter] postNotificationName:kNewAddressCreatedNotification object:nil];
}

//RCT_EXPORT_METHOD(createNewAddressWithWalletId:(NSString*)walletId num:(NSInteger)num) {
//  NSError *error;
//  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
//  NSString *password = [self passwordWithPinCode:pinCode];
//  MobileNewAddress(walletId, num, password, &error);
//
//  [[NSNotificationCenter defaultCenter] postNotificationName:kNewAddressCreatedNotification object:nil];
//}

RCT_REMAP_METHOD(sendSkyCoinWithWalletId, sendSkyCoinWithWalletId:(NSString*)walletId toAddress:(NSString*)toAddr amount:(NSString*)amount resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  NSString *password = [self passwordWithPinCode:pinCode];
  MobileSend(kCoinTypeSky, walletId, toAddr, amount, password, &error);
  if(!error) {
    resolve(@"success");
    [[NSNotificationCenter defaultCenter] postNotificationName:kCoinSentNotification object:nil];
  } else {
    resolve([error.userInfo getStringForKey:@"NSLocalizedDescription"]);
  }
}

//used for samos
RCT_REMAP_METHOD(sendCoinWithWalletType, sendCoinWithWalletType:(NSString*)walletType walletId:(NSString*)walletId toAddress:(NSString*)toAddr amount:(NSString*)amount resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  NSString *password = [self passwordWithPinCode:pinCode];
  MobileSend(walletType, walletId, toAddr, amount, password, &error);
  if(!error) {
    resolve(@"success");
    [[NSNotificationCenter defaultCenter] postNotificationName:kCoinSentNotification object:nil];
  } else {
    resolve([error.userInfo getStringForKey:@"NSLocalizedDescription"]);
  }
}

//-(void) getAddressDictArray {
//  NSError *error;
//  NSString *addressJsonStr = MobileGetAddresses(self.walletModel.walletId, &error);
//  NSDictionary *addressDict = [SWUtils dictionaryFromJsonString:addressJsonStr];
//  self.addressArray = [addressDict getArrayForKey:@"addresses"];
//
//  if(self.addressArray) {
//    NSMutableArray *mutableAddressArray = [[NSMutableArray alloc] init];
//
//    float totalCoinBalance = 0;
//    float totalHourBalance = 0;
//
//    for (NSString *address in self.addressArray) {
//      WalletBalanceModel *wbm = [[WalletManager sharedInstance] getBalanceOfAddress:address coinType:kCoinTypeSky];
//      NSMutableDictionary *mutableAddressDict = [[NSMutableDictionary alloc] init];
//      NSString *balanceToDisplay = [NSString stringWithFormat:@"%.3f", [wbm.balance floatValue]];
//
//      [mutableAddressDict setObject:address forKey:@"address"];
//      [mutableAddressDict setObject:balanceToDisplay forKey:@"balance"];
//
//      [mutableAddressArray addObject:mutableAddressDict];
//
//      totalCoinBalance += [wbm.balance floatValue];
//      totalHourBalance += [wbm.hours floatValue];
//    }
//
//}

RCT_REMAP_METHOD(getAddressDictArrayOfWalletId, getAddressDictArrayOfWalletId:(NSString*)walletId resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
    NSError *error;
    NSString *addressJsonStr = MobileGetAddresses(walletId, &error);
  if (!error) {
    NSDictionary *addressDict = [SWUtils dictionaryFromJsonString:addressJsonStr];
    NSArray* addressArray = [addressDict getArrayForKey:@"addresses"];
    
    resolve(addressArray?:@[]);
  } else {
    resolve(@[]);
  }
}

RCT_REMAP_METHOD(sendCoinWithTransactionModelDict, sendCoinWithTransactionModelDict:(NSDictionary*)transactionModelDict resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSError *error;
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  NSString *password = [self passwordWithPinCode:pinCode];

  TransactionModel *transactionModel = [[TransactionModel alloc] initWithDictionary:transactionModelDict];
  if (!transactionModel) {
    resolve(@"transaction information is not valid");
  } else {
    MobileSend(transactionModel.walletType, transactionModel.walletId, transactionModel.targetAddress, transactionModel.amount, password, &error);
    if(!error) {
      [self addWalletTransactionLocally:transactionModel];
      
      resolve(@"success");
      [[NSNotificationCenter defaultCenter] postNotificationName:kCoinSentNotification object:nil];
    } else {
      resolve([error.userInfo getStringForKey:@"NSLocalizedDescription"]);
    }
  }
}

RCT_REMAP_METHOD(isPinCodeValid, isPinCodeValid:(NSString*)pinCode resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
  NSString *localPinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  if ([pinCode isEqualToString:localPinCode]) {
    resolve(@(YES));
  } else {
    resolve(@(NO));
  }
}

- (void)addWalletTransactionLocally:(TransactionModel*)tm {
  NSArray *localWalletArray = [self getLocalWalletArray];
  NSMutableArray *mutableLocalWalletArray = [NSMutableArray new];
  
  for (GeneralWalletModel* gWM in localWalletArray) {
    if ([gWM isKindOfClass:[GeneralWalletModel class]]) {
      NSArray *subWalletArray = gWM.subWalletArray;
      for (WalletModel *wm in subWalletArray) {
        if ([wm isKindOfClass:[WalletModel class]] && [wm.walletId isEqualToString:tm.walletId]) {
          [wm addTransaction:tm];
        }
      }
      
      [mutableLocalWalletArray addObject:gWM];
    }
  }
  
  NSData *data = [NSKeyedArchiver archivedDataWithRootObject:mutableLocalWalletArray];
  [[NSUserDefaults standardUserDefaults] setObject:data forKey:kLocalWalletArray];
  
}

RCT_EXPORT_METHOD(updateSupportedWalletsArray:(NSString*)walletId supportedWalletsArray:(NSArray*)supportedWalletArray resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSLog(@"%@", supportedWalletArray);
  NSArray *localWalletArray = [self getLocalWalletArray];
  for (GeneralWalletModel *gWM in localWalletArray) {
    if ([gWM isKindOfClass:[GeneralWalletModel class]] && [gWM.walletId isEqualToString:walletId]) {
      gWM.supportedWalletTypes = [NSMutableArray arrayWithArray:supportedWalletArray];
      
      break;
    }
  }
  
  NSData *data = [NSKeyedArchiver archivedDataWithRootObject:localWalletArray];
  [[NSUserDefaults standardUserDefaults] setObject:data forKey:kLocalWalletArray];
  
  [[NSNotificationCenter defaultCenter] postNotificationName:kGeneralWalletNeedRefreshNotification object:nil];
  
  resolve(@"success");
}

RCT_EXPORT_METHOD(updateGeneralWalletName:(NSString*)walletId walletName:(NSString*)walletName hint:(NSString*)hint resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSArray *localWalletArray = [self getLocalWalletArray];
  for (GeneralWalletModel *gWM in localWalletArray) {
    if ([gWM isKindOfClass:[GeneralWalletModel class]] && [gWM.walletId isEqualToString:walletId]) {
      gWM.walletName = walletName;
      break;
    }
  }
  
  NSData *data = [NSKeyedArchiver archivedDataWithRootObject:localWalletArray];
  [[NSUserDefaults standardUserDefaults] setObject:data forKey:kLocalWalletArray];
  
  if (hint) {
    [[NSUserDefaults standardUserDefaults] setObject:hint forKey:kPinCodeHint];
  }
  
  [[NSNotificationCenter defaultCenter] postNotificationName:kGeneralWalletNeedRefreshNotification object:nil];
  
  resolve(@"success");
}

RCT_REMAP_METHOD(getPinCodeHint, getPinCodeHintWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

  NSString *pinCodeHint = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCodeHint];
  if(pinCodeHint) {
    resolve(pinCodeHint);
  } else {
    resolve(@"");
  }
}


RCT_REMAP_METHOD(getCurrentTime, getCurrentTimeWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSDate *currentDate = [NSDate date];
  NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
  [formatter setDateFormat:@"yyyy-MM-dd HH:mm:ss zzz"];
  NSString *dateString = [formatter stringFromDate:currentDate];
  resolve(dateString);
}

RCT_REMAP_METHOD(removeWallet, removeWallet:(NSString*)walletId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSArray *localWalletArray = [self getLocalWalletArray];
  if (localWalletArray.count <= 1) {
    resolve(@"you should at least have 1 wallet");
//    return;
  } else {
    NSError *error;
    for (GeneralWalletModel *gVM in localWalletArray) {
      if ([gVM.walletId isEqualToString:walletId]) {
        for (WalletModel *wm in gVM.subWalletArray) {
          MobileRemove(wm.walletId, &error);
        }
      }
    }
  
  if (!error) {
    [self removeWalletLocally:walletId];
    resolve(@"success");
  } else {
    resolve([error.userInfo getStringForKey:@"NSLocalizedDescription"]);
  }
  }
}

RCT_REMAP_METHOD(removeGeneralWallet, removeGeneralWallet:(NSDictionary*)generalWalletModelDict resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSArray *localWalletArray = [self getLocalWalletArray];
  if (localWalletArray.count <= 1) {
    resolve(@"you should at least have 1 wallet");
    //    return;
  } else {
    NSError *error;
    GeneralWalletModel *gWM = [[GeneralWalletModel alloc] initWithDictionary:generalWalletModelDict];
    for (WalletModel*wm in gWM.subWalletArray) {
      if (wm.walletId) {
        MobileRemove(wm.walletId, &error);
      }
    }
    
    if (!error) {
      [self removeWalletLocally:gWM.walletId];
      resolve(@"success");
    } else {
      resolve([error.userInfo getStringForKey:@"NSLocalizedDescription"]);
    }
  }
}

RCT_EXPORT_METHOD(refreshWalletList) {
  [[NSNotificationCenter defaultCenter] postNotificationName:kRefreshWalletListNotification object:nil];
}

RCT_EXPORT_METHOD(refreshAddressList) {
  [[NSNotificationCenter defaultCenter] postNotificationName:kRefreshAddressListNotification object:nil];
}

- (NSString*)passwordWithPinCode:(NSString*)pinCode {
  NSString *password = [NSString stringWithFormat:@"%ld", [pinCode hash]];
  return password;
}

- (NSArray*)getLocalWalletArray {
  NSData *data = [[NSUserDefaults standardUserDefaults] objectForKey:kLocalWalletArray];
  if(data) {
    NSArray *walletArray = [NSKeyedUnarchiver unarchiveObjectWithData:data];
    return walletArray;
  } else {
    return nil;
  }
}

RCT_REMAP_METHOD(getLocalWalletDictArray, getLocalWalletDictArrayWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  NSArray *localWalletArray = [self getLocalWalletArray];
  NSMutableArray *localWalletDictArray = [NSMutableArray new];
  for (GeneralWalletModel *wm in localWalletArray) {
    NSDictionary *wmDict = [wm getModelDictionary];
    [localWalletDictArray addObject:wmDict];
  }
  
  resolve(localWalletDictArray);
}

RCT_EXPORT_METHOD(resetCurrentWalletId:(NSString*)currentWalletId) {
  if(currentWalletId && currentWalletId.length > 0) {
    [[NSUserDefaults standardUserDefaults] setObject:currentWalletId forKey:kCurrentWalletId];
    [[NSNotificationCenter defaultCenter] postNotificationName:kGeneralWalletNeedRefreshNotification object:nil];
  }
}

- (void)addWalletLocally:(GeneralWalletModel*)generalWalletModel {
  NSArray *localWalletArray = [self getLocalWalletArray];
  NSMutableArray *mutableLocalWalletArray;
  
  if(localWalletArray && [localWalletArray isKindOfClass:[NSArray class]] && localWalletArray.count > 0) {
    mutableLocalWalletArray = [[NSMutableArray alloc] initWithArray:localWalletArray];
  } else {
    mutableLocalWalletArray = [[NSMutableArray alloc] init];
  }
  
  [mutableLocalWalletArray addObject:generalWalletModel];
  
  NSData *data = [NSKeyedArchiver archivedDataWithRootObject:mutableLocalWalletArray];
  [[NSUserDefaults standardUserDefaults] setObject:data forKey:kLocalWalletArray];
}

- (void)removeWalletLocally:(NSString*)walletId {
  NSArray *localWalletArray = [self getLocalWalletArray];
  NSMutableArray *mutableLocalWalletArray = [NSMutableArray arrayWithArray:localWalletArray];
  
  for (GeneralWalletModel *gWM in localWalletArray) {
    if ([gWM.walletId isEqualToString:walletId]) {
      [mutableLocalWalletArray removeObject:gWM];
      break;
    }
  }
  
  //if the wallet to remove is equal to the current wallet, then we should reset the currentWalletId
  NSString *currentWalletId = [[NSUserDefaults standardUserDefaults] stringForKey:kCurrentWalletId];
  if ([currentWalletId isEqualToString:walletId]) {
    GeneralWalletModel *firstGWM = [mutableLocalWalletArray firstObject];
    if (firstGWM) {
      [self resetCurrentWalletId:firstGWM.walletId];
    } else {}
  }
  
  NSData *data = [NSKeyedArchiver archivedDataWithRootObject:mutableLocalWalletArray];
  [[NSUserDefaults standardUserDefaults] setObject:data forKey:kLocalWalletArray];
  
  [[NSNotificationCenter defaultCenter] postNotificationName:kGeneralWalletListDidChangedNotification object:nil];
}

- (NSString*)getWalletDir {
  NSError *error;
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDirectory = [paths objectAtIndex:0]; // Get documents folder
  NSString *dataPath = [documentsDirectory stringByAppendingPathComponent:@"/SkyWallet"];
  
  if (![[NSFileManager defaultManager] fileExistsAtPath:dataPath])
    [[NSFileManager defaultManager] createDirectoryAtPath:dataPath withIntermediateDirectories:NO attributes:nil error:&error]; //Create folder
  
  return dataPath;
}

- (void)initWallet {
  NSString *pinCode = [[NSUserDefaults standardUserDefaults] stringForKey:kPinCode];
  if (pinCode) {
    NSString *password = [self passwordWithPinCode:pinCode];
    NSError *error;
    MobileInit([self getWalletDir], password, &error);
    
    [self registerNewCoin];
  }
}

- (void)registerNewCoin {
  NSError *error;
//  MobileRegisterNewCoin(@"spocoin", @"47.75.36.182:8620", &error);
//  MobileRegisterNewCoin(@"skycoin", @"47.75.36.182:6420", &error);
  MobileRegisterNewCoin(@"skycoin", @"api.samos.io:6420", &error);
  MobileRegisterNewCoin(@"samos", @"api.samos.io:8640", &error);
  if (error) {
    NSLog(@"register coin failed");
  }
}

//get latest walletModelDict
RCT_REMAP_METHOD(getSubWalletModelDict, getSubWalletModelDict:(NSString*)walletId resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
  NSDictionary *subWalletModelDict = @{};
  NSArray *localGeneralWalletArray = [self getLocalWalletArray];
  for (GeneralWalletModel *gWM in localGeneralWalletArray) {
    if (gWM && [gWM isKindOfClass:[GeneralWalletModel class]]) {
      for (WalletModel *wm in gWM.subWalletArray) {
        if (wm && [wm isKindOfClass:[WalletModel class]] && [wm.walletId isEqualToString:walletId]) {
          subWalletModelDict = [wm getModelDictionary];
          break;
        }
      }
    }
  }
  
  resolve(subWalletModelDict);
}

/**
 {
 "balance":1
 "hours":2
 }
 */
RCT_REMAP_METHOD(getBalanceDictOfWallet, getBalanceDictOfWallet:(NSString*)walletId coinType:(NSString*)coinType resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
  WalletBalanceModel *balanceModel = [self getBalanceOfWallet:walletId coinType:coinType];
  NSDictionary *balanceDict = [balanceModel getModelDictionary];
  
  resolve(balanceDict?:@{});
}

- (WalletBalanceModel*)getBalanceOfWallet:(NSString*)walletId coinType:(NSString*)coinType {
  NSError *error;
  NSString *balanceJsonStr = MobileGetWalletBalance(coinType, walletId, &error);
  NSDictionary *balanceDict = [SWUtils dictionaryFromJsonString:balanceJsonStr];
  WalletBalanceModel *wbm = [[WalletBalanceModel alloc] initWithDictionary:balanceDict];
  
  return wbm;
}

RCT_REMAP_METHOD(getBalanceDictOfAddress, getBalanceDictOfAddress:(NSString*)address coinType:(NSString*)coinType resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
  WalletBalanceModel *balanceModel = [self getBalanceOfAddress:address coinType:coinType];
  NSDictionary *balanceDict = [balanceModel getModelDictionary];
  
  resolve(balanceDict);
}

- (WalletBalanceModel*)getBalanceOfAddress:(NSString*)address coinType:(NSString*)coinType {
  NSError *error;
  NSString *balanceJsonStr = MobileGetBalance(coinType, address, &error);
  NSDictionary *balanceDict = [SWUtils dictionaryFromJsonString:balanceJsonStr];
  WalletBalanceModel *wbm = [[WalletBalanceModel alloc] initWithDictionary:balanceDict];
  
  return wbm;
}

- (NSInteger)getWalletsCount {
  NSInteger walletsCount = [self getLocalWalletArray].count;
  
  return walletsCount;
}

- (TransactionModel*)parseTransactionUrl:(NSString*)transactionUrl {
  NSString *targetAdress = @"";
  NSString *amount = @"";
  NSString *walletId = @"";
  NSString *walletType = @"";
  NSString *transactionType = @"out";
  
  GeneralWalletModel *currentWalletModel = [self getCurrentWalletModel];
  NSURLComponents *urlComponents = [[NSURLComponents alloc] initWithString:transactionUrl];
//  targetAdress = urlComponents.path;//wierd
  
  for (NSURLQueryItem *queryItem in urlComponents.queryItems) {
    if ([queryItem.name isEqualToString:@"address"]) {
      targetAdress = queryItem.value;
    } else if ([queryItem.name isEqualToString:@"token"]) {
      walletType = queryItem.value;
    } else if ([queryItem.name isEqualToString:@"amount"]) {
      amount = queryItem.value;
    }
  }
  
  for (WalletModel *wm in currentWalletModel.subWalletArray) {
    if ([wm.walletType isEqualToString:walletType]) {
      walletId = wm.walletId;
      break;
    }
  }
  
  NSDictionary *transactionDict = @{
                                    @"targetAddress":targetAdress ? : @"",
                                    @"walletId":walletId ? : @"",
                                    @"walletType":walletType ? : @"",
                                    @"amount":amount ? : @"",
                                    @"transactionType":transactionType ? : @""
                                    };
  TransactionModel *transactionModel = [[TransactionModel alloc] initWithDictionary:transactionDict];
  
  return transactionModel;
  
}


RCT_REMAP_METHOD(getCurrentLanguage, getCurrentLanguageWithResolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
  NSString *currentLanguage = [[NSUserDefaults standardUserDefaults] stringForKey:kCurrentLanguage];
  if (!currentLanguage || currentLanguage.length == 0) {
    resolve(@"en");
  } else {
    resolve(currentLanguage);
  }
}

RCT_EXPORT_METHOD(setCurrentLanguage:(NSString*)language) {
  if (language) {
    [[NSUserDefaults standardUserDefaults] setObject:language forKey:kCurrentLanguage];
  }
}

@end

@implementation WalletEventEmitter

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[kRNStopLoadingAnimationNotification,
           kRNGeneralWalletNeedRefreshNotification,
           kRNGeneralWalletListDidChangedNotification,
           kRNGetAddressFromQRCodeNotification
           ];
}

- (NSDictionary *)constantsToExport {
  return @{
           @"stopLoadingAnimationNotification":kRNStopLoadingAnimationNotification,
           @"generalWalletRefreshNotification":kRNGeneralWalletNeedRefreshNotification,
           @"generalWalletListDidChangedNotification":kRNGeneralWalletListDidChangedNotification,
           @"getAddressFromQRCodeNotification":kRNGetAddressFromQRCodeNotification
           };
}

- (instancetype)init {
  self = [super init];
  if (self) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveStopLoadingAnimationNotification:) name:kStopLoadingAnimationNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveGeneralWalletNeedRefreshNotification:) name:kGeneralWalletNeedRefreshNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveGeneralWalletListDidChangedNotification:) name:kGeneralWalletListDidChangedNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveGetAddressFromQRCodeNotification:) name:kGetAddressFromQRCodeNotification object:nil];
  }
  
  return self;
}

//notification sent to js
- (void)didReceiveStopLoadingAnimationNotification:(NSNotification*)notification {
    [self sendEventWithName:kRNStopLoadingAnimationNotification body:nil];
}

- (void)didReceiveGeneralWalletNeedRefreshNotification:(NSNotification*)notification {
  [self sendEventWithName:kRNGeneralWalletNeedRefreshNotification body:nil];
}

- (void)didReceiveGeneralWalletListDidChangedNotification:(NSNotification*)notification {
  [self sendEventWithName:kRNGeneralWalletListDidChangedNotification body:nil];
}

- (void)didReceiveGetAddressFromQRCodeNotification:(NSNotification*)notification {
  NSString *transactionUrl = [notification.userInfo getStringForKey:kUserInfoTargetAddress];
  
  TransactionModel *transactionModel = [WalletSharedManager parseTransactionUrl:transactionUrl];
  
  if (transactionModel.targetAddress && transactionModel.amount) {
    [self sendEventWithName:kRNGetAddressFromQRCodeNotification body:@{@"targetAddress":transactionModel.targetAddress, @"amount":transactionModel.amount}];
  }
}

@end
