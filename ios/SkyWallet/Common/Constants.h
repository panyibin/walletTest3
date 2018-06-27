//
//  Constants.h
//  SkyWallet
//
//  Created by PanYibin on 2018/3/15.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#ifndef Constants_h
#define Constants_h

#define kWalletId @"kWalletId"

#define kLocalWalletArray @"kLocalWalletArray"
#define kPinCode @"kPinCode"
#define kCurrentWalletId @"kCurrentWalletId"

#define kCoinTypeSky @"skycoin"
#define kCoinTypeSamos @"samos"
//#define kCoinTypeSpo @"spocoin"

#define kLastPinCodeFailureTime @"kLastPinCodeFailureTime"
#define kLastSuccessfulSessionTime @"kLastSuccessfulSessionTime"

//Notification
#define kNewAddressCreatedNotification @"kNewAddressCreatedNotification"
#define kNewWalletCreatedNotification @"kNewWalletCreatedNotification"
#define kCoinSentNotification @"kCoinSentNotification"
#define kRefreshWalletListNotification @"kRefreshWalletListNotification"
#define kRefreshAddressListNotification @"kRefreshAddressListNotification"
#define kGetAddressFromQRCodeNotification @"kGetAddressFromQRCodeNotification"

#define kUserInfoTargetAddress @"kUserInfoTargetAddress"

//cooperate with RN Notification
#define kStopLoadingAnimationNotification @"kStopLoadingAnimationNotification"
#define kCurrentWalletDidChangedNotification @"kCurrentWalletDidChangedNotification"

//RN Notification
#define kRNStopLoadingAnimationNotification @"kRNStopLoadingAnimationNotification"
#define kRNCurrentWalletDidChangedNotification @"kRNCurrentWalletDidChangedNotification"

#endif /* Constants_h */
