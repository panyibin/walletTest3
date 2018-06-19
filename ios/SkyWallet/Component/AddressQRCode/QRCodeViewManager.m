//
//  QRCodeViewManager.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/25.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "QRCodeViewManager.h"
#import "QRCodeView.h"

@implementation QRCodeViewManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(qrCodeString,NSString*)

- (UIView*)view {

  QRCodeView *qrCodeView = [[QRCodeView alloc] init];
  
  return qrCodeView;
}

@end
