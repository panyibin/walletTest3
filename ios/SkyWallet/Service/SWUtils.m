//
//  SWUtils.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SWUtils.h"

@implementation SWUtils

+ (NSDictionary*)dictionaryFromJsonString:(NSString*)jsonStr {
  NSDictionary *dict;
  NSError *error;
  NSData *data = [jsonStr dataUsingEncoding:NSUTF8StringEncoding allowLossyConversion:YES];
  if (!data) {
    return nil;
  }
  
  dict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:&error];
  if(!error) {
    return dict;
  } else {
    return nil;
  }
}

+ (UIImage*)qrCodeImageWithString:(NSString*)str width:(CGFloat)width height:(CGFloat)height {
  NSData *stringData = [str dataUsingEncoding: NSUTF8StringEncoding];
  
  CIFilter *qrFilter = [CIFilter filterWithName:@"CIQRCodeGenerator"];
  [qrFilter setValue:stringData forKey:@"inputMessage"];
  [qrFilter setValue:@"H" forKey:@"inputCorrectionLevel"];
  
  CIImage *qrImage = qrFilter.outputImage;
  float scaleX = width / qrImage.extent.size.width;
  float scaleY = height / qrImage.extent.size.height;
  
  qrImage = [qrImage imageByApplyingTransform:CGAffineTransformMakeScale(scaleX, scaleY)];
  
  return [UIImage imageWithCIImage:qrImage scale:[UIScreen mainScreen].scale orientation:UIImageOrientationUp];

}

+ (ScreenType)getScreenType {
  ScreenType currentScreenType = ScreenTypeUnknown;
  
  if([[UIDevice currentDevice]userInterfaceIdiom]==UIUserInterfaceIdiomPhone) {
    
    switch ((int)[[UIScreen mainScreen] nativeBounds].size.height) {
        
      case 1136:
        printf("iPhone 5 or 5S or 5C");
        currentScreenType = ScreenTypeiPhoneSmall;
        break;
      case 1334:
        printf("iPhone 6/6S/7/8");
        currentScreenType = ScreenTypeiPhoneMiddle;
        break;
      case 1920:
      case 2208:
        printf("iPhone 6+/6S+/7+/8+");
        currentScreenType = ScreenTypeiPhonePlus;
        break;
      case 2436:
        printf("iPhone X");
        currentScreenType = ScreenTypeiPhoneX;
        break;
      default:
        currentScreenType = ScreenTypeUnknown;
        printf("unknown");
    }
  }
  
  return currentScreenType;
}

@end
