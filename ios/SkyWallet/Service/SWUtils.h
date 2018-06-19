//
//  SWUtils.h
//  SkyWallet
//
//  Created by PanYibin on 2018/3/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSUInteger, ScreenType){
  ScreenTypeiPhoneSmall,//iPhone 5, SE, etc
  ScreenTypeiPhoneMiddle, //iPhone 6, 7, etc
  ScreenTypeiPhonePlus, //iPhone 6P, 7P, etc
  ScreenTypeiPhoneX,   //iPhone X
  ScreenTypeUnknown
};

@interface SWUtils : NSObject

+ (NSDictionary*)dictionaryFromJsonString:(NSString*)jsonStr;

+ (UIImage*)qrCodeImageWithString:(NSString*)str width:(CGFloat)width height:(CGFloat)height;

+ (ScreenType)getScreenType;

@end
